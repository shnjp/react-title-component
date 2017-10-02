import React from 'react'
import expect from 'expect'
import { render } from 'react-dom'
import { renderToString } from 'react-dom/server'
import { findRenderedComponentWithType } from 'react-dom/test-utils'
import Title, { flushTitle } from '../Title'

describe('Title', () => {

    beforeEach(() => {
        flushTitle()
        document.title = ''
    })

    class A extends React.Component {
        render() {
            return (
                <div>
                    <Title render="A"/>
                    <B/>
                </div>
            )
        }
    }

    class B extends React.Component {
        constructor() {
            super()

            this.state = {
                title: 'B'
            }
        }

        render() {
            return (
                <div>
                    <Title render={prev => `${prev} | ${this.state.title}`}/>
                    <C/>
                </div>
            )
        }
    }

    class C extends React.Component {
        render() {
            return (
                <div>
                    <Title render={prev => `${prev} | C`}/>
                </div>
            )
        }
    }

    it('renders the title', (done) => {
        const div = document.createElement(div)
        render(<A/>, div, () => {
            expect(document.title).toEqual('A | B | C')
            done()
        })
    })

    it('handles state changes in the middle of a chain', (done) => {
        // incidentally tests the previous and next instances
        // not getting screwed up too.
        const div = document.createElement(div)
        render(<A/>, div, function () {
            expect(document.title).toEqual('A | B | C')
            const b = findRenderedComponentWithType(this, B)
            b.setState({
                title: 'B Updated'
            }, () => {
                expect(document.title).toEqual('A | B Updated | C')
                done()
            })
        })
    })

    describe('server rendering with flushTitle', () => {
        it('returns the title', () => {
            renderToString(<A/>)
            const title = flushTitle()
            expect(title).toEqual('A | B | C')
        })

        it('can handle multiple renders (simulating multiple requests)', () => {
            renderToString(<A/>)
            const title = flushTitle()
            expect(title).toEqual('A | B | C')
            // next request comes in
            const NEW_TITLE = 'sorry, I used a singleton'
            renderToString(<Title render={NEW_TITLE}/>)
            const newTitle = flushTitle()
            expect(newTitle).toEqual(NEW_TITLE)
        })
    })

})
