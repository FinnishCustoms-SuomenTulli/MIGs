<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:param name="language"/>
	<xsl:template match="Introduction">
		<table class="table table-striped table-condensed">
			<thead>
				<tr>
					<xsl:choose>
						<xsl:when test="$language='fi'">
							<th>Versio ja päivämäärä</th>
							<th>Muutoksen syy</th>
							<th>Skeema</th>
							<th>Tietosisältö</th>
							<th>Sanomaliikenneopas</th>
						</xsl:when>
						<xsl:when test="$language='sv'">
							<th>Version och datum</th>
							<th>Orsak till ändring</th>
							<th>Schema</th>
							<th>Datainnehåll</th>
							<th>Guide för meddelandetrafik</th>
						</xsl:when>
						<xsl:when test="$language='en'">
							<th>Version and date</th>
							<th>Reason for amendment</th>
							<th>Schema</th>
							<th>Data requirements</th>
							<th>Guide for message exchange</th>
						</xsl:when>
					</xsl:choose>
				</tr>
			</thead>
			<xsl:for-each select="VersionHistory/Version">
				<tr>
					<td>
						<xsl:value-of select="Number"/>
						<br/>
						<xsl:choose>
							<xsl:when test="string-length(Date)=10">
								<xsl:choose>
									<xsl:when test="$language='en'">
										<xsl:value-of select="concat(substring(Date,9,2), '/', substring(Date,6,2), '/', substring(Date,1,4))"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="concat(substring(Date,9,2), '.', substring(Date,6,2), '.', substring(Date,1,4))"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="Date"/>
							</xsl:otherwise>
						</xsl:choose>
					</td>
					<td>
						<xsl:value-of select="Remarks[@lang=($language)]"/>
					</td>
					<td align="center">
						<xsl:if test="Schema=1">•</xsl:if>
					</td>
					<td align="center">
						<xsl:if test="Data=1">•</xsl:if>
					</td>
					<td align="center">
						<xsl:if test="ME=1">•</xsl:if>
					</td>
				</tr>
			</xsl:for-each>
		</table>
		<xsl:for-each select="VersionHistory/Version">
			<div class="modal" tabindex="-1" role="dialog" data-keyboard="false">
				<xsl:attribute name="id"><xsl:value-of select="concat('Version_',position())"/></xsl:attribute>
				<div class="modal-dialog modal-lg" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h1 class="modal-title">
								<xsl:choose>
									<xsl:when test="$language='fi'">
										<xsl:value-of select="concat('Versio ',Number)"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="concat('Version ',Number)"/>
									</xsl:otherwise>
								</xsl:choose>
							</h1>
						</div>
						<div class="modal-body">
							<xsl:for-each select="Notes/Note[@lang=($language)]">
								<p>
									<xsl:value-of select="."/>
									<xsl:if test="position() != last()">
									</xsl:if>
								</p>
							</xsl:for-each>
						</div>
					</div>
				</div>
			</div>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>
