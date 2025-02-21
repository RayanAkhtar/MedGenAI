
interface StatsProp {
    measure: string,
    value: string
}

 const Statsbox: React.FC<StatsProp> = ({measure, value} : StatsProp) => {
    return <div>
        {measure}: {value}
    </div>
}
export default Statsbox