from urllib.request import urlopen
import re
from typing import Tuple


URL = 'https://www.juegosonce.es/resultados-cupon-diario'
BACKUP_URL = 'https://www.once.es/juegos-once/cupon-diario'


def get_cupon_diaro() -> Tuple[str, str]:
    with urlopen(URL) as response:
        html = response.read().decode('utf-8')

        numprem_re = re.findall(r'<span.*class="numprem">(.+)</span>', str(html))
        if len(numprem_re) == 0:
            exception = Exception('No se ha podido obtener el número ganador del día')
            raise exception

        number = max(numprem_re, key=len)
        serie = min(numprem_re, key=len)

        return (number, serie)

def get_cupon_diario_backup() -> Tuple[str, str]:
    with urlopen(BACKUP_URL) as response:
        html = response.read().decode('utf-8')

        numprem_re = re.findall(r'<span class="premios-juegos-once__numerofield">(.+)</span>', str(html))
        serie_re = re.findall(r'<span class="premios-juegos-once__seriefield">(.+)</span>', str(html))
        if len(numprem_re) == 0 or len(serie_re) == 0:
            exception = Exception('No se ha podido obtener el número ganador del día')
            raise exception

        number = numprem_re[0]
        serie = serie_re[0]

        return (number, serie)

def get_winner():
    """
    Returns the winner number of the day.
    Given a serial number, range from 1 to 50 and a number,
    range from 00000 to 99999, return the winner of the day."""
    try:
        number, serie = get_cupon_diaro()
    except:
        number, serie = get_cupon_diario_backup()
    
    serie = int(serie)
    serie = serie - 1

    number = str(serie) + number
    return number

def get_winner_given_selled_tickets(selled_tickets: int, number: str = None):
    """
    Get the winner and select the number of numbers
    that will be used based on the selled tickets.
    The maximum number given by get_winner is 49,999,999
    
    Parameters:
    selled_tickets: int
        The number of selled tickets.
    number: str
        The number of the winner of the day.
        Avoid to calculate the winner again.
    
    Returns:
    str
        The winner number of the day."""

    # Test that the number of selled tickets is positive
    assert selled_tickets >= 0, 'The number of selled tickets must be positive'
    # Test that the number of selled tickets is less than 50,000,000
    assert selled_tickets < 50000000, 'The number of selled tickets must be less than 50,000,000'
    
    if number is None:
        number = get_winner()

    if selled_tickets <= 9:
        number = number[-1:]
    elif selled_tickets <= 99:
        number = number[-2:]
    elif selled_tickets <= 999:
        number = number[-3:]
    elif selled_tickets <= 9999:
        number = number[-4:]
    elif selled_tickets <= 99999:
        number = number[-5:]
    elif selled_tickets <= 999999:
        number = number[-6:]
    
    return number


if __name__ == '__main__':
    # print(get_cupon_diaro())
    print(get_winner())
    print(get_winner_given_selled_tickets(4000000))
    print(get_winner_given_selled_tickets(400000))
    print(get_winner_given_selled_tickets(40000))
    print(get_winner_given_selled_tickets(4000))
    print(get_winner_given_selled_tickets(400))
    print(get_winner_given_selled_tickets(40))
    print(get_winner_given_selled_tickets(4))
    # Test assertion by number of tickets lower than 0
    
    try:
        get_winner_given_selled_tickets(-1)
    except AssertionError as e:
        print(e)
    
    # Test assertion by number of tickets greater than 50,000,000
    try:
        get_winner_given_selled_tickets(50000000)
    except AssertionError as e:
        print(e)