import { useEffect, useState } from 'preact/hooks'
import { getAvailableComments, extractAvailableScriptsFromNode, getCurrentTab, getCurrentTabHTML, findHardcodedJavaScriptParams } from '../content'
import CommentList from '../components/CommentList'
import ParametersList from '../components/ParametersList'
import APIKeyList from '../components/APIKeysList'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner';
import StaticFileList from '../components/StaticFileList'

export const Popup = () => {
  const [hiddenComments, setHiddenComments] = useState([])
  const [scripts, setScripts] = useState([])
  const [paramsData, setParamsData] = useState([])
  const [apiKeys, setAPIKeys] = useState([])
  const [files, setFiles] = useState([])
  const [isLoading, setLoading] = useState(false)

  const unHideComments = async () => {
    const currentTabInfo = await getCurrentTab()

    if (currentTabInfo && currentTabInfo.id) {
      const tabHTML = await getCurrentTabHTML(currentTabInfo.id)

      if (tabHTML) {
        var parseDom = new DOMParser()
        const domDocument = parseDom.parseFromString(tabHTML, 'text/html')
        const availableComments = await getAvailableComments(domDocument)
        setHiddenComments(availableComments)
      }
    }
  }

  const fetchScripts = async () => {
    setLoading(true)
    const currentTabInfo = await getCurrentTab()
    const tabHTML = await getCurrentTabHTML(currentTabInfo.id)
    var parseDom = new DOMParser()
    const domDocument = parseDom.parseFromString(tabHTML, 'text/html')
    const availableScripts = await extractAvailableScriptsFromNode(domDocument)
    if(availableScripts){
      
      setScripts(availableScripts)
      setLoading(false)
    }
  }

  const fetchParameters = async () => {
    setLoading(true);
    const uniqueArr = [];
    for (let x in scripts) {
       uniqueArr.push(await findHardcodedJavaScriptParams(scripts[x], 'parameter_scanner'));
    }

    const filteredData = uniqueArr.filter(col => col.words !== '')
      
    setParamsData(filteredData);
    
    setLoading(false);
  };
  

  const detectAPIKeys = async () => { 
    setLoading(true);
    let uniqueArr = []
    for(let x in scripts){
      uniqueArr.push(await findHardcodedJavaScriptParams(scripts[x], 'detect_api_keys'))
    }

    const filteredData = uniqueArr.filter(col => col.APIKeys !== '')

    setAPIKeys(filteredData)
    setLoading(false)
  }

  const detectStaticFiles = async () => {
    setLoading(true);
    let uniqueArr = []
    for(let x in scripts){
      console.log(scripts[x])
      uniqueArr.push(await findHardcodedJavaScriptParams(scripts[x], 'detect_static_files'))
    }

    const filteredData = uniqueArr.filter(col => col.files !== '')

    setFiles(filteredData)
    setLoading(false)
  }

  // list hidden comments once
  useEffect(() => {
    unHideComments()
    // load current domain's related scripts
    fetchScripts()
  }, [])

  return (
    <main>
      <h3>Unhide HTML &diams;</h3>
      <div className="d-grid gap-2 mb-4 mt-4">
        <Button
          variant="outline-primary"
          size="md"
          disabled={isLoading}
          onClick={!isLoading ? fetchParameters : null}
        >
          {isLoading ? 'Loading…' : `Parameters Scanner`} &#9981;
        </Button>
        <Button variant="outline-success" size="md"
          disabled={isLoading}
          onClick={!isLoading ? detectStaticFiles : null}
        >
          {isLoading ? 'Loading…' : `Critical Files`} &#9889;
        </Button>
        <Button variant="outline-danger" size="md"
          disabled={isLoading}
          onClick={!isLoading ? detectAPIKeys : null}
        >
          {isLoading ? 'Loading…' : `Detect API Keys`} &#9817;
        </Button>        
      </div>

      <Spinner hidden={isLoading ? false : true} animation="grow" variant="primary" />

      <div class="mb-2 mt-2">
        <ParametersList parameterKeys={paramsData} />
        <hr />
        <APIKeyList apiKeys={apiKeys} />
        <hr />
        <StaticFileList files={files}  />
        <hr />
        <CommentList comments={hiddenComments} />

      </div>

      <h6 className="mb-4 mt-4 text-secondary text-bold">v 1.0.0</h6>
      <a href="https://github.com/abbddkr" target="_blank">
        @abbddkr
      </a>
    </main>
  )
}

export default Popup
