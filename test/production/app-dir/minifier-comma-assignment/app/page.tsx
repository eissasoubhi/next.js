import * as M from '../repro.js'

export default function Page() {
  return <pre>{Object.keys(M).join(', ')}</pre>
}
