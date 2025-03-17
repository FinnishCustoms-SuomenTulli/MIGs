<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:param name="language"/>
	<xsl:param name="messageType"/>
	<xsl:key name="filterDefinitions" match="CodeLists/Definitions/Filter" use="Name"/>
	<xsl:template match="/">
		<div class="container">
			<div>
				<a href="../../../../codelists/codelists.xml">
					<xsl:choose>
						<xsl:when test="$language='fi'">
							<span class="icon icon-tulli-external" style="margin-right:3px"/>Lataa koodistot XML-muodossa</xsl:when>
						<xsl:when test="$language='sv'">
							<span class="icon icon-tulli-external" style="margin-right:3px"/>Ladda ner kodlistorna i XML-format</xsl:when>
						<xsl:when test="$language='en'">
							<span class="icon icon-tulli-external" style="margin-right:3px"/>Download codelists in XML format</xsl:when>
					</xsl:choose>
				</a>
				<p/>
			</div>
			<div class="row">
				<div class="accordion">
					<xsl:for-each select="CodeLists/CodeList">
						<div class="accordion-row" style="display: block">
								<xsl:attribute name="id">
									<xsl:value-of select="concat('panel_',Identification)"/>
								</xsl:attribute>
							<xsl:attribute name="data-codelist">
								<xsl:value-of select="Identification"/>
							</xsl:attribute>
							<a class="accordion-link" role="button" data-toggle="collapse" aria-expanded="false">
								<xsl:attribute name="href">
									<xsl:value-of select="concat('#CODELIST_',Identification)"/>
								</xsl:attribute>
								<xsl:attribute name="aria-controls">
									<xsl:value-of select="Name[@lang=($language)]"/>
								</xsl:attribute>
								<xsl:value-of select="concat(Identification,' - ',Name[@lang=($language)])"/>
								<span class="icon icon-tulli-chevron-tight-down"/>
							</a>
							<div class="accordion-content collapse">
								<xsl:attribute name="id">
									<xsl:value-of select="concat('CODELIST_',Identification)"/>
								</xsl:attribute>
								<xsl:attribute name="aria-labelledby">
									<xsl:value-of select="concat('CODELIST_',Identification)"/>
								</xsl:attribute>
								<div style="display: none">
									<xsl:for-each select="CodeItem">
										<xsl:variable name="start" select="concat(substring(StartDate,1,4), substring(StartDate,6,2), substring(StartDate,9,2))"/>
										<xsl:variable name="end" select="concat(substring(EndDate,1,4), substring(EndDate,6,2), substring(EndDate,9,2))"/>
										<xsl:if test="$messageType >= $start and $end >= $messageType">
										<xsl:value-of select="concat(Code, '|', Name[@lang=($language)], '|')"/>
											</xsl:if>
									</xsl:for-each>
								</div>
								<div class="accordion-content-container">
									<xsl:attribute name="data-codelist">
										<xsl:value-of select="Identification"/>
									</xsl:attribute>
								</div>
							</div>
						</div>
					</xsl:for-each>
				</div>
			</div>
		</div>
	</xsl:template>
</xsl:stylesheet>