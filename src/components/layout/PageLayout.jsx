"use client";

const PageLayout = ({children}) => {
    return (
        <div className="max-w-[1400px] mx-auto py-5 md:pb-24 md:pt-10 px-4 xl:px-0">
            {children}
        </div>
    );
};

export default PageLayout;