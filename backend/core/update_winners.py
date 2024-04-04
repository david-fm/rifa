from core.models import Ganador, Campania, Reserva
from utils.winner import get_winner_given_selled_tickets, get_winner

from typing import List

def get_for_update_campaigns() -> List[Campania]:
    """
    Returns a list of campaigns that need to get a winner."""

    campaigns = Campania.objects.filter(has_winner=False, has_end=True)

    return campaigns

def update_winners():
    """
    Update the winners of the campaigns that need to get a winner."""

    campaigns = get_for_update_campaigns()
    winner_number = get_winner()
    # If there is an error getting the winner no winner will be selected
    # and the function will raise an exception 
    for campaign in campaigns:
        try:
            selled_tickets = Reserva.objects.filter(campania=campaign).count()
            winner = get_winner_given_selled_tickets(selled_tickets, winner_number)

            Ganador.objects.create(reserva=Reserva.objects.get(campania=campaign, id_ticket=winner))
            campaign.has_winner = True
            campaign.save()
        except:
            continue
    

if __name__ == '__main__':
    update_winners()