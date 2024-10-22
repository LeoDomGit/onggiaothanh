import React, { useState } from 'react'
import CKEditor from '../Components/CKEditor'
function Index() {
    const [content, setContent] = useState('');
    return (
        <>
            <CKEditor
                value={content}
                onBlur={setContent}
            />
        </>
    )
}

export default Index