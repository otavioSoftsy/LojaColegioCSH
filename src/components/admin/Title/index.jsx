import './title.css'
import PropTypes from "prop-types"


Title.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
}

export default function Title({children, name}) {
  return (
    <div className="card mb-5">
      <div className='card-body title'>
        {children}
        <span>{name}</span>
      </div>
    </div>
  )
} 