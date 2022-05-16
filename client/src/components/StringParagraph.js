import React from 'react'

const StringParagraph = ({string, showStatistics}) => {
    

    if(!showStatistics) {
        return (
            <div id="stringDiv">
                <br></br>
                <h4 className="text-center" id="string">{string}</h4>
            </div>
        )
    } else {
        return (
            <></>
        ) 
    }
}

export default StringParagraph
