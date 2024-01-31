<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:param name="language"/>
	<xsl:template match="Introduction">
		<ol>
			<xsl:for-each select="VersionHistory/Version[position() = last()]/Notes/Note[@lang=($language)]">
				<li><xsl:value-of select="." disable-output-escaping="yes"/></li>
			</xsl:for-each>
		</ol>
	</xsl:template>
</xsl:stylesheet>
