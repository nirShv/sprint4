import React, { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom';
import { ImTrello } from 'react-icons/im';
import { BsFillGrid3X3GapFill, BsChevronDown } from 'react-icons/bs';
import { IoSearchSharp } from 'react-icons/io5';
import { AiOutlineBell } from 'react-icons/ai';
import {boardService} from '../services/board.service'


export function AppHeader() {

    const [boards, setBoards] = useState(null)
    


    const onChange = ({ target }) => {
        let filterBy = {
            title: target.value
        }
        boardService.query(filterBy)
        .then(res=>console.log('res:', res))
    }

    return (
        <section className="app-header">

            <BsFillGrid3X3GapFill className='menu-logo' />
            <Link to="/" className='home-logo-link'>
                <ImTrello className='trello-logo' />
                <section className="logo">
                    sTrello
                </section>
            </Link>

            <section className='nav-header'>
                <ul>
                    <Link to="board" className='workspace-link'><li>Workspaces <BsChevronDown className='downArr' /></li></Link>
                    <li>Recent <BsChevronDown className='downArr' /></li>
                    <li>Starred <BsChevronDown className='downArr' /></li>
                </ul>
                <span className='create'>Create</span>
            </section>

            <section className='search'>
                <IoSearchSharp className='mag-glass' /><input type="text" onChange={onChange} placeholder='Search' />
            </section>
            <section className='bell'>
                <AiOutlineBell />
            </section>

        </section>
    )

}

