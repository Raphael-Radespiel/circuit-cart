function Carousel({children}){

  return (
      <div className="product-carousel">
        <button>&#60;</button>
        {children}
        <button>&#62;</button>
      </div>
  );
}

export default Carousel;
