import {useHttp} from '../../hooks/http.hook';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { heroesDeleted, fetchHeroes, filteredHeroesSelector } from './heroesSlice';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';
import './heroesList.scss';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {

    const filteredHeroes = useSelector(filteredHeroesSelector);

    // const filteredHeroes = useSelector(state => {
    //     if (state.filters.activeFilter === 'all') {
    //         return state.heroes.heroes;
    //     } else {
    //         return state.heroes.heroes.filter(item => item.element === state.filters.activeFilter);
    //     }
    // })

    const { heroesLoadingStatus} = useSelector(state => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(fetchHeroes());
        // eslint-disable-next-line
    }, []);

    const deleteHero = useCallback((id) => {
        request(`http://localhost:3001/heroes/${id}`, 'DELETE')
            .then(dispatch(heroesDeleted(id)))
            .catch(err => console.log(err));

        // eslint-disable-next-line
    }, [request])

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            <CSSTransition
                timeout={0}
                classNames="hero">
                <h5 className="text-center mt-5">Героев пока нет</h5>
            </CSSTransition>
        }

        return arr.map(({id, ...props}) => {
            return <CSSTransition key={id} timeout={500} classNames="hero">
                        <HeroesListItem onDelete={() => deleteHero(id)} {...props}/>
                   </CSSTransition>
        })
    }

    const elements = renderHeroesList(filteredHeroes);
    return (
        <TransitionGroup component="ul">
            {elements}
        </TransitionGroup>

    )
}

export default HeroesList;