const SchemaTypes = {
  CONNECTION_INFO: 16,
  MIGRATION: 1,
  REPLICA: 4,
}

let parseToFields = schema => {
  let fields = Object.keys(schema.properties).map(fieldName => {
    let field = {
      ...schema.properties[fieldName],
      name: fieldName,
      required: schema.required && schema.required.find(k => k === fieldName) ? true : fieldName === 'username' || fieldName === 'password',
    }
    return field
  })

  let sortPriority = { username: 1, password: 2 }
  fields.sort((a, b) => {
    if (sortPriority[a.name] && sortPriority[b.name]) {
      return sortPriority[a.name] - sortPriority[b.name]
    }
    if (sortPriority[a.name] || (a.required && !b.required)) {
      return -1
    }
    if (sortPriority[b.name] || (!a.required && b.required)) {
      return 1
    }
    return a.name.localeCompare(b.name)
  })

  return fields
}

let parsersToFields = {
  general: schema => {
    return parseToFields(schema.oneOf[0])
  },
  azure: schema => {
    let commonFields = parseToFields(schema).filter(f => f.type !== 'object' && f.name !== 'secret_ref')

    let getOption = (option) => {
      return {
        name: option,
        type: 'radio',
        fields: [
          ...parseToFields(schema.properties[option]),
          ...commonFields,
        ],
      }
    }

    let radioGroup = {
      name: 'login_type',
      default: 'user_credentials',
      type: 'radio-group',
      items: [getOption('user_credentials'), getOption('service_principal_credentials')],
    }

    return [radioGroup]
  },
}

let parseToPayload = (data, schema) => {
  let info = {}

  Object.keys(schema.properties).forEach(fieldName => {
    if (data[fieldName] && typeof data[fieldName] !== 'object') {
      info[fieldName] = data[fieldName]
    }
  })

  return info
}

let parsersToPayload = {
  general: (data, schema) => {
    return parseToPayload(data, schema.oneOf[0])
  },
  azure: (data, schema) => {
    let payload = parseToPayload(data, schema)
    payload[data.login_type] = parseToPayload(data, schema.properties[data.login_type])
    return payload
  },
}

class SchemaParser {
  static storedSchemas = {}

  static generateField(name, label, required = false) {
    return {
      name,
      label,
      type: 'string',
      required,
    }
  }

  static schemaToFields(provider, schema) {
    if (!this.storedSchemas[provider]) {
      this.storedSchemas[provider] = schema
    }

    if (!parsersToFields[provider]) {
      provider = 'general'
    }

    let fields = parsersToFields[provider](schema)

    fields = [
      this.generateField('name', 'Endpoint Name', true),
      this.generateField('description', 'Endpoint Description'),
      ...fields,
    ]

    return fields
  }

  static fieldsToPayload(data) {
    let storedSchema = this.storedSchemas[data.type] || this.storedSchemas.general
    let payload = {}

    payload.name = data.name
    payload.description = data.description

    if (parsersToPayload[data.type]) {
      payload.connection_info = parsersToPayload[data.type](data, storedSchema)
    } else {
      payload.connection_info = parsersToPayload.general(data, storedSchema)
    }

    return payload
  }
}

export { SchemaTypes, SchemaParser }