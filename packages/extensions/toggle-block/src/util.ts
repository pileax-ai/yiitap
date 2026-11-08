export const shouldSiblingStop = (sibling: any, level: number): boolean => {
  // A level-0 toggle sits outside the heading hierarchy and must stop at
  // the first structural sibling (heading or toggleBlock) it meets.
  if (sibling.type.name === 'heading') {
    const siblingLevel = sibling.attrs.level || 1
    return siblingLevel <= level
  }
  if (sibling.type.name === 'toggleBlock') {
    const siblingLevel = sibling.firstChild?.attrs?.level ?? 0
    if (siblingLevel === 0) return false
    return siblingLevel <= level
  }
  return false
}
