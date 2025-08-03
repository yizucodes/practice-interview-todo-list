import React, { useState, useEffect } from 'react';
import { fetchTodos } from './api/fetchTodos';

export const TodosList = () => {
  // INTERVIEW INSTRUCTIONS:
  // See INTERVIEW_INSTRUCTIONS.md for complete details and questions
  // Implement the features step by step to make the tests pass!
  const [todos, setTodos] = useState<any[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<any[]>([]);
  const [title, setTitle] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  async function getTodos() {
    const response = await fetchTodos(`api/todos`);
    setTodos(response.data.todos);
  }

  useEffect(() => {
    getTodos();
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // mock new todo created for category, completed and priority params
    const newTodo = {
      title,
      description: desc,
      category: 'work',
      completed: false,
      priority: 2,
    };

    setTodos((prev) => [...prev, newTodo]);

    // Clear form after submission
    setTitle('');
    setDesc('');
  }

  function handleSearch(searchVal: string) {
    setSearchInput(searchVal);

    // If search is empty, clear filtered todos
    if (searchVal.trim() === '') {
      setFilteredTodos([]);
      return;
    }

    // filter if title or description includes searchVal
    const searchTerm = searchVal.toLowerCase();
    const filtered = todos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(searchTerm) ||
        todo.description.toLowerCase().includes(searchTerm)
    );

    setFilteredTodos(filtered);
  }

  function handleCheckbox(flag: boolean) {
    setIsCompleted(!flag);

    // when checked --> only show incomplete todos (completed === false)
    const filtered = todos.filter((todo) => todo.completed === !flag);
    console.log('filtered', filtered);
    setFilteredTodos(filtered);
  }

  // Determine which todos to display
  const todosToDisplay =
    searchInput.trim() !== '' || isCompleted ? filteredTodos : todos;

  return (
    <div className='todo-list-container'>
      <div className='search-bar-container'>
        <fieldset>
          <label htmlFor='todo-filter'>Filter Todos: </label>
          <input
            value={searchInput}
            onChange={(event) => handleSearch(event.target.value)}
            id='todo-filter'
            type='text'
            placeholder='Filter'
          />
          <br />
          <input
            onChange={() => handleCheckbox(isCompleted)}
            id='hide-completed'
            type='checkbox'
            checked={isCompleted}
          />
          <label htmlFor='hide-completed'>Hide Completed Todos</label>
        </fieldset>
      </div>

      <div className='create-todo-container' style={{ marginTop: '16px' }}>
        <form onSubmit={handleSubmit}>
          <fieldset style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>Create new Todo</h3>
            <label htmlFor='new-todo-title'>Title: </label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              id='new-todo-title'
              type='text'
            />
            <br />
            <label htmlFor='new-todo-description'>Description: </label>
            <input
              value={desc}
              onChange={(event) => setDesc(event.target.value)}
              id='new-todo-description'
              type='text'
            />
            <button type='submit'>Create new Todo</button>
          </fieldset>
        </form>
      </div>

      <div className='todo-list-results'>
        {todosToDisplay.map((todo, index) => (
          <div key={index}>
            <p>Title: {todo.title}</p>
            <p>Description: {todo.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
