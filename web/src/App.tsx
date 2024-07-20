import _ from 'react'
import AntdFrom from "./Component/antdFrom"
import {zobj,emptyData} from "./Component/antdFrom/testconfig"
function App() {
  return <AntdFrom {...{
    db:emptyData,
    api: { add: console.log },
    zobj,
    // dbCss: {
    //   id_parent: <Select />,
    // }
    
  }} />
}

export default App
