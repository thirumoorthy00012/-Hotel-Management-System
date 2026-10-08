function Pagination({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange
}) {

    const totalPages =
        Math.ceil(
            totalItems / itemsPerPage
        );


    // Don't show if only one page
    if (totalPages <= 1) {
        return null;
    }


    const pages = [];


    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {

        pages.push(i);

    }


    return (

        <div className="pagination">


            {/* PREVIOUS */}

            <button
                onClick={() =>
                    onPageChange(
                        currentPage - 1
                    )
                }
                disabled={
                    currentPage === 1
                }
            >
                Previous
            </button>



            {/* PAGE NUMBERS */}

            {pages.map((page) => (

                <button
                    key={page}
                    onClick={() =>
                        onPageChange(page)
                    }
                    className={
                        currentPage === page
                            ? "active-page"
                            : ""
                    }
                >
                    {page}
                </button>

            ))}



            {/* NEXT */}

            <button
                onClick={() =>
                    onPageChange(
                        currentPage + 1
                    )
                }
                disabled={
                    currentPage === totalPages
                }
            >
                Next
            </button>


        </div>

    );
}


export default Pagination;