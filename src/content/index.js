import { allowed_words, allowed_files, key_patterns } from './allowed_fields'

/**
 * The function `getCurrentTab` retrieves the currently active tab in the Chrome browser.
 * @returns the currently active tab in the Chrome browser.
 */
export async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true }
  let [tab] = await chrome.tabs.query(queryOptions)
  return tab
}

/**
 * The function `getCurrentTabHTML` is a JavaScript function that uses the Chrome extension API to
 * retrieve the HTML content of the current tab.
 * @param tabId - The `tabId` parameter is the ID of the tab for which you want to retrieve the HTML.
 * @returns The function `getCurrentTabHTML` returns a Promise that resolves to the HTML content of the
 * current tab identified by `tabId`.
 */
export async function getCurrentTabHTML(tabId) {
  return new Promise((resolve) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        function: () => {
          return document.documentElement.outerHTML
        },
      },
      (result) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError)
          resolve(null)
        } else {
          resolve(result[0].result)
        }
      },
    )
  })
}

/**
 * The function `getAvailableComments` recursively searches through the child nodes of a given node and
 * returns an array of objects containing the titles and randomly generated IDs of all the comments
 * found.
 * @param node - The `node` parameter represents the root node from which you want to extract comments.
 * It can be any HTML element or node in the DOM tree. The function recursively traverses through the
 * child nodes of the given `node` and checks if each child node is a comment node or an element node.
 * @returns an array of objects. Each object represents a comment found in the given node and has two
 * properties: "title" which represents the comment text, and "id" which is a randomly generated number
 * between 0 and 1000.
 */
export async function getAvailableComments(node) {
  var arr = []
  for (let i = 0; i < node.childNodes.length; i++) {
    let childNode = node.childNodes[i]
    if (childNode.nodeType === 8) {
      arr.push({ title: childNode.data, id: Math.floor(Math.random() * 1000) })
    }

    if (childNode.nodeType === 1) {
      arr.push.apply(arr, await getAvailableComments(childNode))
    }
  }

  return arr
}

/**
 * The function is used to retrieve available scripts from a given node.
 * @param node - The node parameter is the current node or element in the DOM (Document Object Model)
 * that you want to search for available scripts.
 */
export async function extractAvailableScriptsFromNode(node) {
  var scriptArr = []
  const currentTabOrigin = await getCurrentTab()
  const list = node.scripts
  for (let i = 0; i < list.length; i++) {
    if (list[i].getAttribute('src')) {
      var scriptSrc = list[i].getAttribute('src')
      if (scriptSrc.startsWith('//')) {
        scriptArr.push(scriptSrc)
      } else if (scriptSrc.startsWith('./') || scriptSrc.startsWith('/')) {
        const fullUrl = new URL(scriptSrc, currentTabOrigin.url).href;
        scriptArr.push(fullUrl);
      }
    }
  }

  return scriptArr
}

/**
 * The function searches for a hardcoded JavaScript URL.
 * @param url - The URL of the website or API endpoint you want to search.
 */
export async function findHardcodedJavaScriptParams(url, type = 'parameter_scanner') {
  try {
    const response = await fetch(url)
    if (response.ok) {
      const responseBody = await response.text()
      if (type == 'parameter_scanner') {
        const foundAllowedWords = allowed_words.filter((word) => responseBody.includes(word))
        const nonEmptyStrings = foundAllowedWords.filter(
          (word) => typeof word !== 'undefined' && word.length > 0,
        )
        return {
          id: Math.floor(Math.random() * 1000),
          words: nonEmptyStrings.join(', '),
          source: url,
        }
      } else if (type == 'detect_api_keys') {
        const foundKeys = detectAPIKeys(responseBody)
        const nonEmptyStrings = foundKeys.filter(
          (data) => typeof data !== 'undefined' && data.length > 0,
        )
        return {
          id: Math.floor(Math.random() * 1000),
          APIKeys: nonEmptyStrings.join(','),
          source: url,
        }
      } else if (type == 'detect_static_files') {
        const foundAllowedFiles = allowed_files
          .filter((file) => typeof file !== 'undefined' && file.length > 0)
          .filter((file) => responseBody.includes(file))
        return {
          id: Math.floor(Math.random() * 1000),
          files: foundAllowedFiles.join(', '),
          source: url,
        }
      } else {
        return {}
      }
    } else {
      throw new Error(`Request failed with status ${response.status}`)
    }
  } catch (error) {
    console.error('An error occurred:', error)
    throw error
  }
}

function detectAPIKeys(text = '') {
  const foundKeys = []
  key_patterns.forEach((pattern, i) => {
    const matches = text.match(pattern)
    if (matches) {
      foundKeys.push(...matches)
    }
  })

  return foundKeys
}
