export default (data: string): Blob => {
    return new Blob([data], { type: 'text/csv' })
}