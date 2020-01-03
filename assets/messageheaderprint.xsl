<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:param name="language"/>
	<xsl:param name="messageType"/>
	<xsl:template match="/">
		<h2><xsl:value-of select="$messageType"/> - <xsl:value-of select="MessageExchange/Messages/Message/Name[@lang=($language)][../ID=$messageType]"/>
		</h2>
	</xsl:template>
</xsl:stylesheet>