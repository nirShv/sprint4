
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'
import { getActionRemoveBoard, getActionAddBoard, getActionUpdateBoard } from '../store/board.actions.js'
import { store } from '../store/store'

// This file demonstrates how to use a BroadcastChannel to notify other browser tabs 

const STORAGE_KEY = 'board'

const boardChannel = new BroadcastChannel('boardChannel')


    ; (() => {
        boardChannel.addEventListener('message', (ev) => {
            store.dispatch(ev.data)
        })
    })()

export const boardService = {
    query,
    getById,
    save,
    remove,
    getEmptyBoard,
    getGroupById,
    // updateTask,
    getTaskById,
    removeGroup
}
window.cs = boardService


async function query(filterBy) {
    try {

        let boards = await storageService.query(STORAGE_KEY)
        if (filterBy?.title) {
            boards = boards.filter(b => b.title.toLowerCase().includes(filterBy.title.toLowerCase()))
        }

        return boards
    } catch (err) {
        throw err
    }
}
async function getById(boardId) {
    try {
        return await storageService.get(STORAGE_KEY, boardId)
    }
    catch (err) {
        throw err
    }
    // return axios.get(`/api/board/${boardId}`)

}

async function remove(boardId) {
    await storageService.remove(STORAGE_KEY, boardId)
    boardChannel.postMessage(getActionRemoveBoard(boardId))
}

async function removeGroup(boardId, groupId) {
    try {
        let boardToUpdate = await getById(boardId)
        console.log('boardToUpdate', boardToUpdate)
        boardToUpdate.groups = boardToUpdate.groups.filter(group => group.id !== groupId)
        return await save(boardToUpdate)
    } catch (err) {
        throw err
    }
}

async function save(board) {
    var savedBoard
    if (board._id) {
        console.log('update board')
        savedBoard = await storageService.put(STORAGE_KEY, board)
        boardChannel.postMessage(getActionUpdateBoard(savedBoard))

    } else {
        // Later, owner is set by the backend
        console.log('new board')
        // board.owner = userService.getLoggedinUser()
        savedBoard = await storageService.post(STORAGE_KEY, board)
        boardChannel.postMessage(getActionAddBoard(savedBoard))
    }
    return savedBoard
}

function getEmptyBoard() {
    return {
        _id: utilService.makeId(),
        price: utilService.getRandomIntInclusive(1000, 9000),
    }
}

async function getGroupById(boardId, groupId) {
    try {
        const board = await storageService.get(STORAGE_KEY, boardId)
        return board.groups.find(group => group.id === groupId)
    }
    catch (err) {
        throw err
    }
}

async function getTaskById(boardId, groupId, taskId) {
    try {
        const group = await getGroupById(boardId, groupId)
        const task = group.tasks.find(task => task.id === taskId)
        return task

    } catch (err) {
        throw err
    }
}

// TEST DATA
// storageService.post(STORAGE_KEY, {vendor: 'Subali Rahok 2', price: 980}).then(x => console.log(x))




