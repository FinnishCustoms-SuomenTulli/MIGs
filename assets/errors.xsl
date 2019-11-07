<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:param name="language"/>
	<xsl:template match="Introduction">
		<p>
			<xsl:choose>
				<xsl:when test="//Errors/Error != ''">
					<xsl:for-each select="//Errors/Error[@lang=($language)]">
						<xsl:value-of select="."/>
						<xsl:if test="position() != last()">
							<br/>
						</xsl:if>
					</xsl:for-each>
				</xsl:when>
				<xsl:otherwise>
					<xsl:if test="$language='fi'">Ei tunnettuja virheitä.</xsl:if>
					<xsl:if test="$language='sv'">Ej kända fel.</xsl:if>
					<xsl:if test="$language='fi'">No known errors.</xsl:if>
				</xsl:otherwise>
			</xsl:choose>
		</p>
	</xsl:template>
</xsl:stylesheet>
