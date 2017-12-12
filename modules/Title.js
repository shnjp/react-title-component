import { Component } from 'react'
import { oneOfType, string, func } from 'prop-types'

let titles = []
let counter = 0

function getTitle() {
    return titles.reduce((current, title) => {
        const render = title.render
        return typeof render === 'function'
        ? render(current || '')
        : render
    }, '')
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
            title.render = render
        }

        return this.props.children || null
    }

}
