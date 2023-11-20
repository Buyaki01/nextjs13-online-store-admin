const SearchProductsPage = ({searchedProduct}) => {
  return (
    <div>
      {searchedProduct.map(product => (
        <div>
          <div>
            <img src="" alt=""/>
          </div>

          <div>
            <p>{product.productName}</p>
            <h4>Ksh. {product.price}</h4>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SearchProductsPage