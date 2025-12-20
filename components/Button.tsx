'use client'
type Props = {
  classname?: string;
  text ?: string
};

const Button = ({classname,text} : Props) => {
  return (
    <button className={`cursor-pointer hover:scale-105 transition-all duration-300 ${classname} `}>
        {text}
    </button>
  )
}

export default Button