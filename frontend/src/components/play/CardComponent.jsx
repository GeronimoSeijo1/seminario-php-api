import PropTypes from 'prop-types';
import '../../assets/styles/play/CardComponent.css';

const CardComponent = ({ carta, isPlayable, isSelected, onClick, isServerCard }) => {
    const cardClass = `card-item ${isSelected ? 'selected' : ''} ${isPlayable ? 'playable' : 'not-playable'} ${isServerCard ? 'server-card' : ''}`;

    const handleClick = () => {
        if (isPlayable) {
            onClick(carta);
        }
    };

    return (
        <div className={cardClass} onClick={handleClick}>
            {isServerCard && carta.atributo === '?' ? (
                <div className="card-back">
                    <p>Servidor</p>
                    <p>Atributo: {carta.atributo}</p>
                </div>
            ) : (
                <>
                    <div className="card-header">
                        <h3>{carta.nombre}</h3>
                    </div>
                    <div className="card-body">
                        <p>Atributo: <strong>{carta.atributo}</strong></p>
                        <p>Ataque: <strong>{carta.ataque}</strong></p>
                        {/* Puedes agregar una imagen de la carta aquí */}
                        {/* <img src={carta.imagenUrl} alt={carta.nombre} className="card-image" /> */}
                    </div>
                </>
            )}
        </div>
    );
};

CardComponent.propTypes = {
    carta: PropTypes.shape({
        id: PropTypes.number,
        nombre: PropTypes.string.isRequired,
        atributo: PropTypes.string.isRequired,
        ataque: PropTypes.number,
        estado: PropTypes.string, // 'en_mazo', 'en_mano', 'descartado'
        imagenUrl: PropTypes.string,
    }).isRequired,
    isPlayable: PropTypes.bool,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func,
    isServerCard: PropTypes.bool,
};

CardComponent.defaultProps = {
    isPlayable: true,
    isSelected: false,
    onClick: () => {},
    isServerCard: false,
};

export default CardComponent;