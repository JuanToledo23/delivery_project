import loaderImg from 'assets/img/spinning-circles.svg';
import './Loader.css';

function Loader() {
  
  return (
    <div>
      <div className="loading">
        <img src={loaderImg} alt="loader" />
      </div>
    </div>
  );
}

export default Loader;
