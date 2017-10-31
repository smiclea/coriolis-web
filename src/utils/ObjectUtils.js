class ObjectUtils {
  static flatten(object) {
    let result = {}

    Object.keys(object).forEach(k => {
      if (typeof object[k] === 'object') {
        if (object[k]) {
          result = { ...result, ...this.flatten(object[k]) }
        }
      } else {
        result[k] = object[k]
      }
    })

    if (Object.keys(result).length === 0) {
      return null
    }

    return result
  }

  static skipField(object, fieldName) {
    let result = {}

    if (Object.keys(object).length === 0) {
      return null
    }

    Object.keys(object).forEach(k => {
      if (k !== fieldName) {
        result[k] = object[k]
      }
    })

    if (Object.keys(result).length === 0) {
      return null
    }

    return result
  }
}

export default ObjectUtils
