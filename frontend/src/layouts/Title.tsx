
interface ITitle {
    title: string;
    text: string;
}

const Title = ({ title, text }: ITitle) => {

    return (
        <section className="page__title">
            <div className="title__wrapper">
                <h1 className="title">{ title }</h1>
                <p className="subtitle">{ text }</p>
            </div>
        </section>
    )
}

export default Title;