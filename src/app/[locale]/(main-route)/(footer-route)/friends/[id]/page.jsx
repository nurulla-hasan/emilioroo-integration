import PageLayout from "@/components/layout/PageLayout";


const SingleFriend = ({params}) => {
    const id = params.id
    return (
        <div className="min-h-minus-header">
            <PageLayout>
                <h1>Single Friend {id}</h1>
            </PageLayout>
        </div>
    );
};

export default SingleFriend;