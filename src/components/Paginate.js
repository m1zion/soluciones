import React from 'react';
import { Typography, Box } from '@mui/material';
const Paginate = ({ productsPerPage, totalPosts, paginate, previousPage, nextPage, currentPage}) => {
   /*console.log("paginate");
   console.log(paginate);*/
   const pageNumbers = [];
   for (let i = 1; i <= Math.ceil(totalPosts / productsPerPage); i++) {
      pageNumbers.push(i);
   }
   const showPagination = 5;
   let visiblePageNumbers = [];
   //console.log(currentPage);
   
   if (currentPage === 1) {
      visiblePageNumbers = pageNumbers.slice(0, showPagination);
  } else if (currentPage === pageNumbers.length) {
      visiblePageNumbers = pageNumbers.slice(-showPagination);
  } else {
      const start = Math.max(currentPage - 2, 0);
      const end = Math.min(currentPage + 2, pageNumbers.length - 1);
      visiblePageNumbers = pageNumbers.slice(start, end + 1);
  }

   return (
      <Box className='pagination_rounded_container'>
         <Box className="pagination_rounded">
            <ul>
               {currentPage > 1 && (
                        <li onClick={() => paginate(1)}>
                           <a className="prev">
                              <i className="fa fa-angle-left" aria-hidden="true"></i>
                              <i className="fa fa-angle-left" aria-hidden="true"></i>
                           </a>
                        </li>
               )}

               <li onClick={previousPage}><a className="prev"> <i className="fa fa-angle-left" aria-hidden="true"></i></a></li>
               {visiblePageNumbers.map((number) => (
               <li
                  key={number}
                  onClick={() => paginate(number)}
               >
                  <a className={(number === currentPage) ? 'currentNumber' : '' }>{number}</a>
               </li>
               ))}
               <li onClick={nextPage}><a className="next"> <i className="fa fa-angle-right" aria-hidden="true"></i></a></li>
               {currentPage < pageNumbers.length && (
                        <li onClick={() => paginate(pageNumbers.length)}>
                           <a className="next">
                              <i className="fa fa-angle-right" aria-hidden="true"></i>
                              <i className="fa fa-angle-right" aria-hidden="true"></i>
                           </a>
                        </li>
                  )}
            </ul>
         </Box>
      </Box>

   );
   /*return (
      <Box className="pagination-container">
         <ul className="pagination">
            <li onClick={previousPage} className="page-number">Prev</li>
            {pageNumbers.map((number) => (
            <li
               key={number}
               onClick={() => paginate(number)}
               className="page-number"
            >


               {number}
            </li>
            ))}
            <li onClick={nextPage} className="page-number">Next</li>
         </ul>
      </div>
   );*/
};
 
export default Paginate;