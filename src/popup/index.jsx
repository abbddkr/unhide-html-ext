import { render } from 'preact'
import { Popup } from './Popup'
import './index.css'
import '../content'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Popup.css'

render(<Popup />, document.getElementById('app'))
