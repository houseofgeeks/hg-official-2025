'use client'
type Props = {
  classname?: string;
  text ?: string;
  onClick?: () => void;
};

const Button = ({classname,text, onClick} : Props) => {
  return (
    <button 
      onClick={onClick} 
      className={`cursor-pointer hover:scale-105 transition-all duration-300 touch-manipulation active:scale-95 ${classname}`}
    >
        {text}
    </button>
  )
}

export default Button