
import { useDispatch, useSelector } from "react-redux";
import { filtersChanged, filtersFetched, selectAll } from "./filtersSlice";
import {useEffect} from 'react';
import Spinner from "../spinner/Spinner";
import store from '../../store'
import classNames from "classnames";

// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {
    const dispatch = useDispatch();
    const { filtersLoadingStatus, activeFilter} = useSelector(state => state.filters);
    const filters = selectAll(store.getState());
    useEffect(() => {
        dispatch(filtersFetched());
    }, []);

    if (filtersLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderItems = (arr) => {
        if(arr.length === 0) {
            return <h5 className="text-center mt-5">Фильтры не найдены</h5>
        }

        return arr.map(({name, label, className}) => {
            const btnClass = classNames('btn', className, {
                'active': name === activeFilter
            });

            return <button key={name}
                           id={name} 
                           className={btnClass} 
                           onClick={() => dispatch(filtersChanged(name))}
                   >{label}</button>
        })
    }
    const filtersElements = renderItems(filters);
    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {filtersElements}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;