package it.pa.repdgt.ente.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.pa.repdgt.ente.entity.projection.UtenteProjection;
import it.pa.repdgt.ente.exception.ResourceNotFoundException;
import it.pa.repdgt.ente.repository.ReferentiDelegatiEnteGestoreProgettoRepository;
import it.pa.repdgt.shared.annotation.LogExecutionTime;
import it.pa.repdgt.shared.annotation.LogMethod;
import it.pa.repdgt.shared.entity.ReferentiDelegatiEnteGestoreProgettoEntity;
import it.pa.repdgt.shared.entity.key.ReferentiDelegatiEnteGestoreProgettoKey;

@Service
public class ReferentiDelegatiEnteGestoreProgettoService {
	@Autowired
	private ReferentiDelegatiEnteGestoreProgettoRepository referentiDelegatiEnteGestoreProgettoRepository;
	
	// MI SERVE
	/**
	 * @throws ResourceNotFoundException
	 * */
	@LogMethod
	@LogExecutionTime
	public void save(ReferentiDelegatiEnteGestoreProgettoEntity referentiDelegatiEnteGestoreProgetto) {
		this.referentiDelegatiEnteGestoreProgettoRepository.save(referentiDelegatiEnteGestoreProgetto);
	}
	
	public List<UtenteProjection> getReferentiEnteGestoreByIdProgettoAndIdEnte(Long idProgetto, Long idEnte) {
		return this.referentiDelegatiEnteGestoreProgettoRepository.findNomeStatoReferentiEnteGestoreByIdProgettoAndIdEnte(idProgetto, idEnte);
	}
	
	public List<UtenteProjection> getDelegatiEnteGestoreByIdProgettoAndIdEnte(Long idProgetto, Long idEnte) {
		return this.referentiDelegatiEnteGestoreProgettoRepository.findNomeStatoDelegatiEnteGestoreByIdProgettoAndIdEnte(idProgetto, idEnte);
	}

	public boolean esisteById(ReferentiDelegatiEnteGestoreProgettoKey id) {
		return this.referentiDelegatiEnteGestoreProgettoRepository.existsById(id);
	}

	public ReferentiDelegatiEnteGestoreProgettoEntity getById(ReferentiDelegatiEnteGestoreProgettoKey id) {
		return this.referentiDelegatiEnteGestoreProgettoRepository.findById(id).get();
	}

	public List<ReferentiDelegatiEnteGestoreProgettoEntity> findAltriReferentiODelegatiAttivi(Long idProgetto, String codiceFiscaleUtente, Long idEnte, String codiceRuolo) {
		return this.referentiDelegatiEnteGestoreProgettoRepository.findAltriReferentiODelegatiAttivi(idProgetto, codiceFiscaleUtente, idEnte, codiceRuolo);
	}

	public List<ReferentiDelegatiEnteGestoreProgettoEntity> findAltreAssociazioni(Long idProgetto, String codiceFiscaleUtente, String codiceRuolo) {
		return this.referentiDelegatiEnteGestoreProgettoRepository.findAltreAssociazioni(idProgetto, codiceFiscaleUtente, codiceRuolo);
	}
	
	public void cancellaAssociazioneReferenteDelegatoGestoreProgetto(
			ReferentiDelegatiEnteGestoreProgettoKey id) {
		this.referentiDelegatiEnteGestoreProgettoRepository.deleteById(id);
	}

	public List<ReferentiDelegatiEnteGestoreProgettoEntity> getReferentiAndDelegatiPerProgetto(Long idProgetto) {
		return this.referentiDelegatiEnteGestoreProgettoRepository.findReferentieDelegatiPerProgetto(idProgetto);
	}
	
	public List<String> getEmailReferentiAndDelegatiPerProgetto(Long idProgetto) {
		return this.referentiDelegatiEnteGestoreProgettoRepository.findEmailReferentieDelegatiPerProgetto(idProgetto);
	}

	public void cancellaAssociazione(ReferentiDelegatiEnteGestoreProgettoEntity utente) {
		this.referentiDelegatiEnteGestoreProgettoRepository.delete(utente);
	}

	public int countAssociazioniReferenteDelegato(String codFiscaleUtente, String codiceRuolo) {
			return this.referentiDelegatiEnteGestoreProgettoRepository.countAssociazioniReferenteDelegato(codFiscaleUtente, codiceRuolo);
	}

	public ReferentiDelegatiEnteGestoreProgettoEntity getReferenteDelegatiEnteGestoreProgetto(Long idProgetto,
			String codiceFiscaleUtente, Long idEnte, String codiceRuolo) {
		String errorMessage = String.format("Associazione di utente con codiceFiscale =%s a ente gestore di progetto con id=%s per progetto con id=%s con codice ruolo =%s non trovata", codiceFiscaleUtente, idEnte, idProgetto, codiceRuolo);
		return this.referentiDelegatiEnteGestoreProgettoRepository.findReferenteDelegatiEnteGestoreProgetto(idProgetto, codiceFiscaleUtente, idEnte, codiceRuolo)
																   .orElseThrow( () -> new ResourceNotFoundException(errorMessage));
	}

	public List<ReferentiDelegatiEnteGestoreProgettoEntity> getReferentiAndDelegatiByIdProgettoAndIdEnte(Long idProgetto, Long idEnte) {
		return this.referentiDelegatiEnteGestoreProgettoRepository.findReferentiAndDelegatiByIdProgettoAndIdEnte(idProgetto, idEnte);
	}
}