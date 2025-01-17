package it.pa.repdgt.surveymgmt.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;

import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import it.pa.repdgt.surveymgmt.exception.CittadinoException;
import it.pa.repdgt.surveymgmt.projection.CittadinoProjection;

public class CSVCittadiniUtil {
	private static final List<String> HEADERS = Arrays.asList(
			"ID",
			"NOME",
			"COGNOME",
			"NUMERO SERVIZI",
			"NUMERO QUESTIONARI COMPILATI"
		);

	public static ByteArrayInputStream exportCSVCittadini(List<CittadinoProjection> cittadini, CSVFormat csvFormat) {
		CSVCittadiniUtil.ordinaListaCittadiniPerNomeAsc(cittadini);
		try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
				CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(outputStream), csvFormat);) {
			if (cittadini == null || cittadini.isEmpty()) {
				csvPrinter.printRecord(Arrays.asList("Nessun record presente"));
				return new ByteArrayInputStream(outputStream.toByteArray());
			}
			
			csvPrinter.printRecord(HEADERS);
			for(CittadinoProjection cittadino : cittadini) {
				csvPrinter.printRecord(CSVCittadiniUtil.getCSVRecord(cittadino));
			}
			csvPrinter.flush();
			return new ByteArrayInputStream(outputStream.toByteArray());
		} catch (IOException ex) {
			throw new CittadinoException("Errore export csv cittadini", ex, CodiceErroreEnum.CIT03);
		}
	}

	private static void ordinaListaCittadiniPerNomeAsc(List<CittadinoProjection> cittadini) {
		cittadini.sort((cittadino1, cittadino2) -> cittadino1.getNome().compareTo(cittadino2.getNome()));
	}

	private static List<String> getCSVRecord(CittadinoProjection cittadino) {
		return  Arrays.asList(
							cittadino.getId().toString(),
							cittadino.getNome(),
							cittadino.getCognome(),
							cittadino.getNumeroServizi().toString(),
							cittadino.getNumeroQuestionariCompilati() == null? "0" : cittadino.getNumeroQuestionariCompilati().toString()
						);
		
	}
}
