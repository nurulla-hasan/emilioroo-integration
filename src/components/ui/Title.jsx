

const Title = ({children}) => {
    return (
        <h1 className='md:text-2xl text-xl text-primary dark:text-white font-bold text-center sm:text-left'>
            {children}
        </h1>
    );
};

export default Title;