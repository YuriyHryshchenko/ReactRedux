
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHttp } from '../../hooks/http.hook';
import { heroesUpdated } from '../heroesList/heroesSlice';
import store from '../../store';
import { selectAll } from '../heroesFilters/filtersSlice';
// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {

    const [name, setName] = useState('');
    const [description, setDiscription] = useState('');
    const [element, setElement] = useState('');

    const {filtersLoadingStatus} = useSelector(state => state.filters);
    const filters = selectAll(store.getState());
    const dispatch = useDispatch();
    const {request} = useHttp();

    const updateHero = (e) => {

        e.preventDefault();

        const hero = {
            id: uuidv4(),
            name,
            description,
            element
        }
        request("http://localhost:3001/heroes", "POST", JSON.stringify(hero))
            .then(dispatch(heroesUpdated(hero)))

        setName('');
        setDiscription('');
        setElement('');
    };

    const renderFilters = (filters, status) => {
        if(status === 'loading') {
            return <option>Загрузка элементов</option>
        } else if (status === 'error'){
            return <option>Ошибка загрузки</option>
        }

        if(filters && filters.length > 0) {

            return filters.map(({name, label}) => {
                if (name === 'all') return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }
    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={updateHero}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name"
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    value={description} 
                    onChange={(e) => setDiscription(e.target.value)}
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    value={element} 
                    onChange={(e) => setElement(e.target.value)}
                    id="element" 
                    name="element">
                    <option >Я владею элементом...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;