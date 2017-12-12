import { Component } from 'react'
import { oneOfType, string, func } from 'prop-types'

let titles = []
let counter = 0

function getTitle() {
    const item = titles.slice(-1).pop()
    return item && item.title
}

function updateTitle() {
    document.title = getTitle()
}

export function flushTitle() {
    const title = getTitle()
    titles = []
    return title
}

export default class Title extends Component {
    constructor() {
        super()

        const key = counter++

        titles.push({
            key: key
        })

        this.state = {
            key: key
        }
    }

    static propTypes = {
        render: oneOfType([ string, func ]).isRequired
    }

    componentWillUnmount() {
        const { key } = this.state
        const index = titles.findIndex((title) => {
            return title.key === key
        })

        if (index !== -1) {
            titles.splice(index, 1)
        }

        updateTitle()
    }

    componentDidMount() {
        updateTitle()
    }

    componentDidUpdate() {
        updateTitle()
    }

    render() {
        const { render } = this.props
        const { key } = this.state

        const index = titles.findIndex((title) => {
            return title.key === key
        })

        if (index !== -1) {
            const title = titles[index]
            const previous = titles[index - 1]
            title.title = typeof render === 'function'
            ? render(previous ? previous.title : '')
            : render
        }

        return this.props.children || null
    }

}
