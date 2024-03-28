<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:param name="language"/>
	<!-- Template to match Description elements -->
	<xsl:template match="Description">
		<pre>
            <!-- Call the template to unescape tags -->
            <xsl:call-template name="unescape-tags">
				<xsl:with-param name="text" select="."/>
			</xsl:call-template>
        </pre>
	</xsl:template>
	<!-- Template to unescape tags -->
	<xsl:template name="unescape-tags">
		<xsl:param name="text"/>
		<xsl:choose>
			<xsl:when test="contains($text, '&lt;Ratkaiseva päivämäärä&gt;')">
				<xsl:value-of select="substring-before($text, '&lt;Ratkaiseva päivämäärä&gt;')" disable-output-escaping="yes"/>
				<xsl:text>&lt;Ratkaiseva päivämäärä&gt;</xsl:text>
				<xsl:call-template name="unescape-tags">
					<xsl:with-param name="text" select="substring-after($text, '&lt;Ratkaiseva päivämäärä&gt;')"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="contains($text, '&lt;Avgörande datum&gt;')">
				<xsl:value-of select="substring-before($text, '&lt;Avgörande datum&gt;')" disable-output-escaping="yes"/>
				<xsl:text>&lt;Avgörande datum&gt;</xsl:text>
				<xsl:call-template name="unescape-tags">
					<xsl:with-param name="text" select="substring-after($text, '&lt;Avgörande datum&gt;')"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="contains($text, '&lt;Decisive Date&gt;')">
				<xsl:value-of select="substring-before($text, '&lt;Decisive Date&gt;')" disable-output-escaping="yes"/>
				<xsl:text>&lt;Decisive Date&gt;</xsl:text>
				<xsl:call-template name="unescape-tags">
					<xsl:with-param name="text" select="substring-after($text, '&lt;Decisive Date&gt;')"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="contains($text, '&lt;TPendDate&gt;')">
				<xsl:value-of select="substring-before($text, '&lt;TPendDate&gt;')" disable-output-escaping="yes"/>
				<xsl:text>&lt;TPendDate&gt;</xsl:text>
				<xsl:call-template name="unescape-tags">
					<xsl:with-param name="text" select="substring-after($text, '&lt;TPendDate&gt;')"/>
				</xsl:call-template>
			</xsl:when>
			<!-- Add more conditions to handle other escaped tags if necessary -->
			<xsl:otherwise>
				<xsl:value-of select="$text" disable-output-escaping="yes"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!-- Original template to match the root node -->
	<xsl:template match="/">
		<xsl:for-each select="Constraints/Constraint">
			<div class="modal fade" tabindex="-1" role="dialog" data-keyboard="false">
				<xsl:attribute name="id">
					<xsl:value-of select="concat('RC_', Code)"/>
				</xsl:attribute>
				<div class="modal-dialog modal-lg" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h1 class="modal-title">
								<xsl:value-of select="Code"/>
							</h1>
						</div>
						<div class="modal-body">
							<!-- Call the template to handle Description elements -->
							<xsl:apply-templates select="Description[@lang = $language]"/>
						</div>
					</div>
				</div>
			</div>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>