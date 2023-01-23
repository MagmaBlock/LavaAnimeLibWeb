// 增加 / 移除收藏
export function switchToMyCollections(laID) {
  let myCollections = getMyCollections()
  let index = myCollections.indexOf(laID) // 返回此 ID 的位置，若找不到则为 -1
  if (index !== -1) {
    // 若找到此 laID
    myCollections.splice(index, 1)
    saveMyCollections(myCollections)
    return
  }
  // 找不到则添加
  myCollections.push(laID)
  saveMyCollections(myCollections)
}

// 读取存储库
export function getMyCollections() {
  let myCollections = window.localStorage.getItem('myCollections')
  if (!myCollections) return []
  else return JSON.parse(myCollections)
}

// 保存
export function saveMyCollections(myCollections) {
  if (typeof myCollections == 'object') {
    myCollections = JSON.stringify(myCollections)
  }
  if (typeof myCollections == 'string') {
    window.localStorage.setItem('myCollections', myCollections)
  }
}

// 判断是否收藏
export function isCollected(laID) {
  let myCollections = getMyCollections()
  let isThisCollected = myCollections.indexOf(laID) // 返回此 ID 的位置，若找不到则为 -1
  return isThisCollected !== -1;
}
