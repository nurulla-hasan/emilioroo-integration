import React from 'react';

const Title = ({children}) => {
    return (
        <h1 className='md:text-2xl text-xl text-primary dark:text-white font-bold mb-6'>
            {children}
        </h1>
    );
};

export default Title;