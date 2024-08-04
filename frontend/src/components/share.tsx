import './share.scss'
import { useState } from 'react'
import { sleep } from '../utils/sleep'

const defaultText = 'Share link'

interface Props {
   link: string
}

const Share = ({ link }: Props) => {
   const [text, setText] = useState(defaultText)

   const onClickHandler = async () => {
      // copy link to clipboard
      await navigator.clipboard.writeText(link)
      setText('Copied!')
      await sleep(1000)
      setText(defaultText)
   }

   return (
      <div className="share">
         <button onClick={onClickHandler}>{text}</button>
      </div>
   )
}

export default Share
