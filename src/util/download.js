const download = async (url, token, fileName) => {
  const response = await fetch(url, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
  const blob = await response.blob()

  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export default download
