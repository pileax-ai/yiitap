/**
 * Remove elements' attributes based on a CSS selector
 * @param {string} htmlString - The HTML string
 * @param {string} selector - The CSS selector (e.g., '[data-id]')
 * @returns {string} - Processed HTML string
 */
export const removeHtmlAttributes = (htmlString: string, selector: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')

  // Find all elements matching the selector
  const elements = doc.querySelectorAll(selector)

  // Extract the attribute name from selector: '[data-id]' -> 'data-id'
  const attrName = selector.replace(/[[\]]/g, '')

  elements.forEach((el) => {
    el.removeAttribute(attrName)
  })

  return doc.body.innerHTML
}
