package it.pa.repdgt.opendata.service;

import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.bson.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import it.pa.repdgt.opendata.bean.OpenDataCittadinoCSVBean;
import it.pa.repdgt.opendata.mongo.collection.SezioneQ3Collection;
import it.pa.repdgt.opendata.mongo.repository.SezioneQ3Repository;
import it.pa.repdgt.opendata.repository.CittadinoRepository;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class OpenDataCSVService {
	@Autowired
	private CittadinoRepository cittadinoRepository;
	@Autowired
	private SezioneQ3Repository sezioneQ3Repository;

	public List<OpenDataCittadinoCSVBean> getAllOpenDataCittadino() {
		List<OpenDataCittadinoCSVBean> openDataCittadini =  this.cittadinoRepository
			.findAllCittadinoServizioSede()
			.stream()
			.map(openDataCittadino -> {
				OpenDataCittadinoCSVBean openDataCittadinoCSVBean = new OpenDataCittadinoCSVBean();
				openDataCittadinoCSVBean.setOpenDataCittadinoProjection(openDataCittadino);
				
				ObjectMapper mapper = new ObjectMapper();
				Optional<SezioneQ3Collection> sezioneQ3 = this.sezioneQ3Repository.findById(openDataCittadino.getIdTemplateQ3Compilato());
				if(sezioneQ3.isPresent()) {
					JsonObject sezioneQ3Compilato = (JsonObject) (sezioneQ3.get().getSezioneQ3Compilato());
					log.info("sezioneQ3={}", sezioneQ3Compilato.getJson());
					try {
						JsonNode sezioneQ3CompilatoNode = mapper.readTree(sezioneQ3Compilato.getJson());
						JsonNode propertiesNode = sezioneQ3CompilatoNode.get("properties");
						Iterator<JsonNode> it = propertiesNode.elements();
						while(it.hasNext()) {
							JsonNode domandaRisposta = (JsonNode) it.next();
							if(domandaRisposta.asText().contains("24")) {
								String risposta = domandaRisposta.asText().split(":")[1].replace("[", "").replace("]", "").replace("'", "").replace("}", "");
								openDataCittadinoCSVBean.setCompetenzeTrattate(risposta);
							}
							if(domandaRisposta.asText().contains("25")) {
								String risposta = domandaRisposta.asText().split(":")[1].replace("[", "").replace("]", "").replace("'", "").replace("}", "");
								openDataCittadinoCSVBean.setAmbitoServizi(risposta);
							}
						}
					} catch (JsonProcessingException ex) {
						log.error("{}", ex);
						new RuntimeException("errore nella creazione del csv open data cittadini", ex);
					}
				}
				return openDataCittadinoCSVBean;
			})
			.collect(Collectors.toList());
			
		return openDataCittadini;
	}
	
	public class SezioneQ3Compilato{
		
	}

}