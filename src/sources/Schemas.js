const SchemaTypes = {
  CONNECTION_INFO: 16,
  MIGRATION: 1,
  REPLICA: 4,
}

let parse = schema => {
  let oneOf = schema.oneOf[0]
  let fields = Object.keys(oneOf.properties).map(fieldName => {
    let field = {
      ...oneOf.properties[fieldName],
      name: fieldName,
      required: oneOf.required.find(k => k === fieldName) ? true : fieldName === 'username' || fieldName === 'password',
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
  azure: schema => {
    return []
  },
}

class SchemaParser {
  static parse(provider, schema) {
    if (!parsers[provider]) {
      return parse(schema)
    }

    return parsers[provider](schema)
  }
}

export { SchemaTypes, SchemaParser }
