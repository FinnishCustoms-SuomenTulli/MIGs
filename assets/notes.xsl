<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:param name="language"/>
	<xsl:template match="Introduction">
		<p>
			<xsl:for-each select="VersionHistory/Version[position() = last()]/Notes/Note[@lang=($language)]">
				<xsl:value-of select="."/>
				<xsl:if test="position() != last()">
					<br/>
				</xsl:if>
			</xsl:for-each>
		</p>
	</xsl:template>
</xsl:stylesheet>
