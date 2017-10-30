const SchemaTypes = {
  CONNECTION_INFO: 16,
  MIGRATION: 1,
  REPLICA: 4,
}

let parse = schema => {
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
    return 0
  })

  return fields
}

let parsers = {
  general: (schema, schemaType) => {
    return parse(schema.oneOf[0], schemaType)
  },
  azure: schema => {
    let commonFields = parse(schema).filter(f => f.type !== 'object' && f.name !== 'secret_ref')

    let getOption = (option) => {
      return {
        name: option,
        type: 'radio',
        fields: [
          ...parse(schema.properties[option]),
          ...commonFields,
        ],
      }
    }

    let radioGroup = {
      name: 'login_type',
      value: 'user_credentials',
      type: 'radio-group',
      items: [getOption('user_credentials'), getOption('service_principal_credentials')],
    }

    return [radioGroup]
  },
}

class SchemaParser {
  static generateField(name, label, required = false) {
    return {
      name,
      label,
      type: 'string',
      required,
    }
  }

  static parseConnectionSchema(provider, schema) {
    if (!parsers[provider]) {
      provider = 'general'
    }

    let fields = parsers[provider](schema)

    fields = [
      this.generateField('name', 'Endpoint Name', true),
      this.generateField('description', 'Endpoint Description'),
      ...fields,
    ]

    return fields
  }
}

export { SchemaTypes, SchemaParser }
