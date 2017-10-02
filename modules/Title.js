import { Component } from 'react'
import { oneOfType, string, func } from 'prop-types'

let titles = []

function getTitle() {
    return titles[titles.length - 1]
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
        this.state = {
            index: titles.push('') - 1
        }
    }

    static propTypes = {
        render: oneOfType([ string, func ]).isRequired
    }

    componentWillUnmount() {
        titles.pop()
    }

    componentDidMount() {
        updateTitle()
    }

    componentDidUpdate() {
        updateTitle()
    }

    render() {
        const { render } = this.props
        const { index } = this.state

        titles[index] = typeof render === 'function'
            ? render(titles[index - 1] || '')
            : render
        return this.props.children || null
    }

}
