class LabelDictionary {
  static get(fieldName) {
    return fieldName.replace(/_/g, ' ')
  }
}

export default LabelDictionary
